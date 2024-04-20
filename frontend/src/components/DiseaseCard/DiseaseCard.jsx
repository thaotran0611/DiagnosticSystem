import React from 'react';
import { Box, Card, Center, Image, Text } from '@chakra-ui/react';

const imagePaths = {
  LD: 'https://cdn-icons-png.flaticon.com/512/508/508778.png',
  HD: 'https://cdn-icons-png.flaticon.com/512/1365/1365806.png',
  Ob: 'https://cdn-icons-png.flaticon.com/512/10038/10038625.png',
  Dep: 'https://cdn-icons-png.flaticon.com/512/10036/10036298.png',
  MC: 'https://cdn-icons-png.flaticon.com/512/8870/8870384.png',
  'AA': 'https://cdn-icons-png.flaticon.com/512/8804/8804463.png',
  'CP': 'https://cdn-icons-png.flaticon.com/128/5800/5800110.png',
  'CND': 'https://t4.ftcdn.net/jpg/04/66/36/39/240_F_466363996_ICn5MrDB5avOpHrc5CgwuqEeuJpknVfE.jpg',
  'PD': 'https://cdn-icons-png.flaticon.com/128/1993/1993383.png',
  'SA': 'https://cdn-icons-png.flaticon.com/128/12310/12310299.png'
};

const mapping_disease = {
  AA: 'Alcohol Abuse',
  CND: 'Chronic Neurologic Dystrophies',
  CP: "Chronic Pain",
  Dep: 	"Depression",
  HD:	"Heart Disease",
  LD:	"Lung Disease",
  MC:	"Metastatic Cancer",
  Ob:	"Obesity",
  PD:	"Psychiatric Disorders",
  SA:	"Substance Abuse"
}

const DiseaseCard = ({ text, hidden }) => {
  return (
    <Box boxSize={100} overflow="hidden" w={100}>
      <Box>
        <Center> 
          <Image src={imagePaths[text]} alt={`Card Image for ${text}`} boxSize="40px"/>
        </Center>
      </Box>
      {hidden ? null : 
        <Box boxSize={100}>
          <Center> 
              <Text fontSize="md" fontWeight="semibold" mb="1" textAlign="center">
              {mapping_disease[text]}
              </Text>
          </Center>
        </Box>
      }
    </Box>
  );
};
export default DiseaseCard;
