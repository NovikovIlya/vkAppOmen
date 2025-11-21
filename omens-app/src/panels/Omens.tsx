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
  Spinner,
  Header,
  Gradient,
  Title
} from '@vkontakte/vkui';
import { 
  Icon56ErrorOutline,

  Icon24ClockOutline,
  Icon24Fire,
  Icon24Favorite,
  Icon24FlashOutline,
  Icon24Crown,
  Icon24SunOutline,

  Icon24Sparkle
} from '@vkontakte/icons';

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

  // Массив градиентов для карточек
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ];

  // Массив иконок
  const icons = [
 
    Icon24Sparkle,
    Icon24Fire,
    Icon24Favorite,
    Icon24FlashOutline,
    Icon24Crown,
    Icon24SunOutline,
   
    Icon24ClockOutline,
  ];

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

  const getRandomGradient = (index: number) => {
    return gradients[index % gradients.length];
  };

  const getRandomIcon = (index: number) => {
    const IconComponent = icons[index % icons.length];
    return <IconComponent />;
  };

  const title = type === 'today' ? 'Приметы на сегодня' : 'Приметы на завтра';

  if (loading) {
    return (
      <Panel id={id}>
        <PanelHeader before={<PanelHeaderBack onClick={() => go('home')} />}>
          {title}
        </PanelHeader>
        <Div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spinner />
        </Div>
      </Panel>
    );
  }

  return (
    <Panel id={id}>
      <PanelHeader before={<PanelHeaderBack onClick={() => go('home')} />}>
        {title}
      </PanelHeader>

      {loading && (
        <Div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 16
        }}>
         
          <Text style={{ color: 'var(--vkui--color_text_secondary)' }}>
            Загружаем приметы...
          </Text>
        </Div>
      )}

      {error && (
        <Placeholder
          icon={<Icon56ErrorOutline />}
        
          action={
            <Button size="m" onClick={fetchOmens}>
              Попробовать снова
            </Button>
          }
        >
         Произошла ошибка {error}
        </Placeholder>
      )}

      {!loading && !error && omens.length > 0 && (
        <>
          <Group 
            header={
              <Header mode="secondary">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8 
                }}>
                 
                  {/* <span>Найдено примет: {omens.length}</span> */}
                </div>
              </Header>
            }
          >
            <Div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {omens.map((omen, index) => (
                <Card 
                  key={omen.id} 
                  mode="shadow"
                  style={{ 
                    overflow: 'hidden',
                    borderRadius: 12,
                    transition: 'transform 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Div style={{ padding: 0 }}>
                    <div style={{ 
                      display: 'flex',
                      gap: 0
                    }}>
                      {/* Левая часть с иконкой */}
                      <div style={{
                        minWidth: 60,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: getRandomGradient(index),
                        color: 'white',
                        padding: '16px 12px'
                      }}>
                        <div style={{ 
                          transform: 'scale(1.5)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getRandomIcon(index)}
                        </div>
                      </div>

                      {/* Правая часть с текстом */}
                      <div style={{ 
                        flex: 1,
                        padding: '16px',
                        background: 'var(--vkui--color_background_content)'
                      }}>
                        <Text style={{ 
                          lineHeight: '22px',
                          fontSize: 15
                        }}>
                          {omen.text}
                        </Text>
                      </div>
                    </div>
                  </Div>
                </Card>
              ))}
            </Div>
          </Group>

          {/* Место для баннера */}
          <div style={{ height: 100 }} />
        </>
      )}

      {!loading && !error && omens.length === 0 && (
        <Placeholder 
          icon={<Icon24SunOutline width={56} height={56} />}
          header="Приметы не найдены"
        >
          Попробуйте позже
        </Placeholder>
      )}
    </Panel>
  );
};

export default Omens;