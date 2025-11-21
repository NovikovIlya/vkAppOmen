import { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, SplitLayout, SplitCol } from '@vkontakte/vkui';

import Home from './panels/Home';
import Omens from './panels/Omens';

export const App = () => {
  const [activePanel, setActivePanel] = useState('home');
  const [fetchedUser, setUser] = useState(null);
  const [omensType, setOmensType] = useState<'today' | 'tomorrow'>('today');

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

  const go = (panel: string, type: 'today' | 'tomorrow' = 'today') => {
    setOmensType(type);
    setActivePanel(panel);
  };

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