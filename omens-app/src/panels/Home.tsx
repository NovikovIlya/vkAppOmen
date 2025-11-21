import { Panel, PanelHeader, Group, CardGrid, Card, Title, Text, Div } from '@vkontakte/vkui';
import { Icon28CalendarOutline, Icon28SunOutline } from '@vkontakte/icons';

interface HomeProps {
  id: string;
  fetchedUser: any;
  go: (panel: string, type?: 'today' | 'tomorrow') => void;
}

const Home: React.FC<HomeProps> = ({ id, fetchedUser, go }) => {
  return (
    <Panel id={id}>
      <PanelHeader>Народные приметы</PanelHeader>
      
      <Group>
        {fetchedUser && (
          <Div>
            <Title level="1" weight="2" style={{ marginBottom: 8 }}>
              Привет, {fetchedUser.first_name}! 👋
            </Title>
            <Text weight="3" style={{ color: 'var(--vkui--color_text_secondary)' }}>
              Узнай, что готовит тебе будущее!
            </Text>
          </Div>
        )}

        <CardGrid size="l">
          <Card 
            mode="shadow"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={() => go('omens', 'today')}
          >
            <Div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon28SunOutline width={56} height={56} />
              <div>
                <Title level="2" weight="2" style={{ color: 'white', marginBottom: 4 }}>
                  На сегодня
                </Title>
                <Text weight="3" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Узнайте приметы на сегодняшний день
                </Text>
              </div>
            </Div>
          </Card>

          <Card 
            mode="shadow"
            style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              cursor: 'pointer'
            }}
            onClick={() => go('omens', 'tomorrow')}
          >
            <Div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Icon28CalendarOutline width={56} height={56} />
              <div>
                <Title level="2" weight="2" style={{ color: 'white', marginBottom: 4 }}>
                  На завтра
                </Title>
                <Text weight="3" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  Узнайте приметы на завтрашний день
                </Text>
              </div>
            </Div>
          </Card>
        </CardGrid>
      </Group>
    </Panel>
  );
};

export default Home;