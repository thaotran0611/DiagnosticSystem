import CircleComponent from '../CircleComponent/CircleComponent' 
import DiseaseCard from '../DiseaseCard/DiseaseCard' 
import React from 'react'; 
import { Center, Spinner, Card, CardHeader, CardBody, Box, StackDivider, Stack, Heading, Text, CardFooter,Button,SimpleGrid, Divider, Flex } from '@chakra-ui/react'; 
import { useNavigate } from "react-router-dom";


const PatientInfor = (data) => { 
    // const data = [ 
    //     { key: 'Ethnicity', value: 'England' }, 
    //     { key: 'Addmission date', value: '12/12/2012' }, 
    //     { key: 'Discharge date', value: '20/12/2012' }, 
    //     { key: 'Addmission type', value: 'Emergency' }, 
    //     { key: 'Addmission location', value: 'EMERGENCY ROOM ADMIT' }, 
    //   ]; 
    const keysToExtract = ['Admission Location', 'Admission Type', 'Admission Time','Discharge Time']; // List of keys to extract
    let keyValueList = []; // Initialize keyValueList as an empty array
    let diseaseList = []; 
    console.log(data.data)
    if (data.data !== null) {
      keyValueList = Object.entries(data.data)
                    .filter(([key, value]) => keysToExtract.includes(key))
                    .map(([key, value]) => { return { key: key, value: value };
      });
      if (data.data.disease_code){
        diseaseList = data.data.disease_code.split(',');
      }
    }
    
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/doctor/patient/detailpatient/${data.data.subject_id}`, { state: { patient_Data: data.data } });
  };  
  return (data.data !== null ? ( 
    <Card width={'98%'} h={'100%'} borderRadius="20px" border="none"> 
      <CardHeader paddingBottom={0}>
        <Flex>
          <Flex>
            <Heading size="md">Patient's Information</Heading> 
            {/* <Box ml="auto"> 
              <Button bg="#3E36B0" color="white">Detail</Button> 
            </Box>  */}
          </Flex>
        </Flex> 
      </CardHeader> 
 
      <CardBody border="1px solid #B9DDDF" borderRadius="20px" p="4" m='2' overflowY="auto" style={{
            scrollbarWidth: 'thin', 
            scrollbarColor: '#A0AEC0 #ffffff', 
          }}> 
        <Stack divider={<StackDivider />} spacing="1"> 
          <Flex> 
                <CircleComponent gender = {data.data.Gender} /> 
                <Flex ml = {2} direction="column"> 
                    <Text margin={0} fontWeight="bold" >{data.data.subject_id} - {data.data.name}</Text> 
                    <Text margin={0}>{data.data['Date of Birth']}</Text> 
                </Flex> 
                <Box ml="auto">
                  <Button bg="#3E36B0" color="white" fontSize={20} fontWeight={600} ml={2} onClick={handleClick}>...</Button>
                </Box>
          </Flex> 

          <Center> 
              <Stack direction="row" spacing="4" m='2'>
                  {diseaseList && diseaseList.length > 0 ? (
                      diseaseList.map((disease, index) => (
                          <DiseaseCard key={index} text={disease} />
                      ))
                  ) : (
                      <Text fontSize="xl" fontWeight="bold">
                          No Disease Detection
                      </Text>
                  )}
              </Stack>
          </Center>

            <SimpleGrid columns={2} spacing={0}> 
                {keyValueList.map((item, index) => ( 
                <React.Fragment key={index}> 
                    <Text fontSize={'sm'} fontWeight="bold">{item.key}:</Text> 
                    <Text fontSize={'sm'}>{item.value}</Text> 
                </React.Fragment> 
                ))} 
            </SimpleGrid> 
        </Stack> 
      </CardBody> 
      {/* <CardFooter> 
        <Box ml="auto"> 
          <Button bg="#3E36B0" color="white">Detail</Button> 
        </Box> 
      </CardFooter>  */}
    </Card> 
  ):  <Card width={'98%'} h={'100%'} borderRadius="20px" border="none"> 
        <Center h={'100%'}>
            <Spinner size="xl" />
        </Center>
      </Card> ); 
}; 
 
export default PatientInfor;
