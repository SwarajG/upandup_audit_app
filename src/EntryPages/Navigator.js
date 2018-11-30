import { createStackNavigator } from 'react-navigation';
import OutletSelector from './OutletSelector';
import EntryOptionSelector from './EntryOptionSelector';
import EntryTabs from './EntryTabs';
import StaffAttendance from './StaffAttendance';
import StaffFoodEntry from './StaffFoodEntry';

const App = createStackNavigator({
  OutletOptions: { screen: OutletSelector },
  EntryOptions: { screen: EntryOptionSelector },
  EntryTabs: { screen: EntryTabs },
  StaffAttendance: { screen: StaffAttendance },
  StaffFoodEntry: { screen: StaffFoodEntry }
});

export default App;