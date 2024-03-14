import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const tabData = [
    { id: 1, label: 'General', content: 'Content for Tab 1' },
    { id: 2, label: 'Medical Test', content: 'Content for Tab 2' },
    { id: 3, label: 'Procedure', content: 'Content for Tab 3' },
    { id: 3, label: 'Prescription', content: 'Content for Tab 4' },
    { id: 3, label: 'Note', content: 'Content for Tab 5' },
    { id: 3, label: 'Diseases', content: 'Content for Tab 6' }
  ];
const MyTabs = () => {
    return (
        <Tabs isFitted variant='enclosed'>
            <TabList>
            {tabData.map((tab) => (
                <Tab key={tab.id}>{tab.label}</Tab>
            ))}
            </TabList>

            <TabPanels>
            {tabData.map((tab) => (
                <TabPanel key={tab.id}>
                <p>{tab.content}</p>
                </TabPanel>
            ))}
            </TabPanels>
        </Tabs>
    )
}
export default MyTabs;
