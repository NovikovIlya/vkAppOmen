import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  Card,
  Div,

  Placeholder,
  Text,
  Button,
  Spinner
} from '@vkontakte/vkui';
import { Icon56ErrorOutline } from '@vkontakte/icons';

interface Omen {
  id: number;
  name: string;
  text: string;
}

interface OmensProps {
  id: string;
  type: 'today' | 'tomorrow';
  go: (panel: string) => void;
}

const Omens: React.FC<OmensProps> = ({ id, type, go }) => {
  const [omens, setOmens] = useState<Omen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOmens();
    showBanner();

    return () => {
      bridge.send('VKWebAppHideBannerAd').catch(console.log);
    };
  }, [type]);

  const fetchOmens = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = type === 'today' 
        ? 'https://expres-js-eight.vercel.app/api/omens'
        : 'https://expres-js-eight.vercel.app/api/omens/tomorrow';

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить приметы');
      }

      const data = await response.json();
      setOmens(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      console.error('Error fetching omens:', err);
    } finally {
      setLoading(false);
    }
  };

  const showBanner = async () => {
    try {
      await bridge.send('VKWebAppShowBannerAd', {
        banner_location: 'bottom'
      });
    } catch (error) {
      console.log('Реклама недоступна:', error);
    }
  };

  const title = type === 'today' ? 'Приметы на сегодня' : 'Приметы на завтра';

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => go('home')} />}>
        {title}
      </PanelHeader>

     {loading && (
        <Spinner />
      )}

      {error && (
        <Placeholder
          icon={<Icon56ErrorOutline />}
          header="Ошибка загрузки"
          action={
            <Button size="m" onClick={fetchOmens}>
              Попробовать снова
            </Button>
          }
        >
          {error}
        </Placeholder>
      )}

      {!loading && !error && omens.length > 0 && (
        <Group>
          <Div>
            <Text 
              style={{ 
                color: 'var(--vkui--color_text_secondary)',
                marginBottom: 16 
              }}
            >
              Найдено примет: {omens.length}
            </Text>

            {omens.map((omen, index) => (
              <Card 
                key={omen.id} 
                mode="outline" 
                style={{ 
                  marginBottom: 12
                }}
              >
                <Div>
                  <div style={{ 
                    display: 'flex', 
                    gap: 12,
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: 14,
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text style={{ lineHeight: '20px' }}>
                        {omen.text}
                      </Text>
                    </div>
                  </div>
                </Div>
              </Card>
            ))}

            <div style={{ height: 80 }} />
          </Div>
        </Group>
      )}

      {!loading && !error && omens.length === 0 && (
        <Placeholder header="Приметы не найдены">
          Попробуйте позже
        </Placeholder>
      )}
    </Panel>
  );
};

export default Omens;