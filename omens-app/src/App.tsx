import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { 
  View, 
  SplitLayout, 
  SplitCol, 
  Placeholder, 
  Button,
  Panel,
  PanelHeader,
  Div,
  Title,
  Text
} from '@vkontakte/vkui';
import { Icon56WifiOutline } from '@vkontakte/icons';

import Home from './panels/Home';
import Omens from './panels/Omens';

export const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState<any>(null);
  const [omensType, setOmensType] = useState<'today' | 'tomorrow'>('today');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = await bridge.send('VKWebAppGetUserInfo');
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    
    bridge.send('VKWebAppInit');
    fetchData();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Проверка при загрузке
    if (!navigator.onLine) {
      setIsOnline(false);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const go = (panel: string, type: 'today' | 'tomorrow' = 'today') => {
    setOmensType(type);
    setActivePanel(panel);
  };

  const checkConnection = () => {
    if (navigator.onLine) {
      setIsOnline(true);
      window.location.reload(); // Перезагружаем приложение
    }
  };

  // Полноэкранная заглушка без интернета
  if (!isOnline) {
    return (
      <SplitLayout>
        <SplitCol>
          <Panel id="offline">
            <PanelHeader>Народные приметы</PanelHeader>
            <Div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '70vh',
              textAlign: 'center',
              padding: '0 24px'
            }}>
              <div style={{
               
                borderRadius: '50%',
                background: 'var(--vkui--color_background_negative)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24
              }}>
                <Icon56WifiOutline 
                  width={56} 
                  height={56}
                  style={{ color: 'var(--vkui--color_icon_negative)' }}
                />
              </div>

              <Title 
                level="2" 
                weight="2" 
                style={{ marginBottom: 12 }}
              >
                Нет подключения к интернету
              </Title>

              <Text 
                style={{ 
                  color: 'var(--vkui--color_text_secondary)',
                  marginBottom: 32,
                  maxWidth: 280
                }}
              >
                Проверьте подключение к сети и попробуйте снова
              </Text>

              <Button 
            
           
              
                onClick={checkConnection}
              >
                Повторить попытку
              </Button>
            </Div>
          </Panel>
        </SplitCol>
      </SplitLayout>
    );
  }

  return (
    <SplitLayout>
      <SplitCol>
        <View activePanel={activePanel}>
          <Home id="home" fetchedUser={fetchedUser} go={go} />
          <Omens id="omens" type={omensType} go={go} />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};