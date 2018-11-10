import { createStackNavigator } from 'react-navigation';
import OutletSelector from './OutletSelector';
import EntryOptionSelector from './EntryOptionSelector';
import EntryTabs from './EntryTabs';

const App = createStackNavigator({
  OutletOptions: { screen: OutletSelector },
  EntryOptions: { screen: EntryOptionSelector },
  EntryTabs: { screen: EntryTabs }
});

export default App;