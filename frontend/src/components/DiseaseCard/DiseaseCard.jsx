import React from 'react';
import { Box, Card, Center, Image, Text } from '@chakra-ui/react';

const imagePaths = {
  Lungs: 'https://cdn-icons-png.flaticon.com/512/508/508778.png',
  Heart: 'https://cdn-icons-png.flaticon.com/512/1365/1365806.png',
  Obesity: 'https://cdn-icons-png.flaticon.com/512/10038/10038625.png',
  Depression: 'https://cdn-icons-png.flaticon.com/512/10036/10036298.png',
  Cancer: 'https://cdn-icons-png.flaticon.com/512/8870/8870384.png',
  'Alcohol Abuse': 'https://cdn-icons-png.flaticon.com/512/8804/8804463.png',
};

const DiseaseCard = ({ text, hidden }) => {
  return (
    <Box w={10} overflow="hidden">
      <Box>
        <Image src={imagePaths[text]} alt={`Card Image for ${text}`}/>
      </Box>
      {hidden ? null : 
        <Box>
          <Center> 
          <Text fontSize="md" fontWeight="semibold" mb="2">
            {text}
          </Text>
          </Center>
        </Box>
      }
    </Box>
  );
};
export default DiseaseCard;
