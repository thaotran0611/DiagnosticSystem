import React from 'react';
import { Box, Card, Image, Text } from '@chakra-ui/react';

const imagePaths = {
  Lungs: 'https://cdn-icons-png.flaticon.com/512/508/508778.png',
  Heart: 'https://cdn-icons-png.flaticon.com/512/1365/1365806.png',
  Obesity: 'https://cdn-icons-png.flaticon.com/512/10038/10038625.png',
  Depression: 'https://cdn-icons-png.flaticon.com/512/10036/10036298.png',
  Cancer: 'https://cdn-icons-png.flaticon.com/512/8870/8870384.png',
  'Alcohol Abuse': 'https://cdn-icons-png.flaticon.com/512/8804/8804463.png',
};

const DiseaseCard = ({ text }) => {
  return (
    <Box w={20} overflow="hidden">
      <Box>
        <Image src={imagePaths[text]} alt={`Card Image for ${text}`}/>
      </Box>
      <Box p="4">
        <Text fontSize="md" fontWeight="semibold" mb="2">
          {text}
        </Text>
      </Box>
    </Box>
  );
};
export default DiseaseCard;
