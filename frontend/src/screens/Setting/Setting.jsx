import React from "react";
import { DoctorLayout } from "../../layout/DoctorLayout";
import { Avatar, AvatarBadge, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Center, Divider, Grid, GridItem, Input, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Stack, Text, Tooltip, VStack } from "@chakra-ui/react";

const Setting = () => {
    const [sliderValue, setSliderValue] = React.useState(5)
    const [showTooltip, setShowTooltip] = React.useState(false)
    return(
        <DoctorLayout
            path={
                <Breadcrumb>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href='#'>Setting</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
        >
            <Grid gridTemplateRows={'40% 30% 30%'}>
                <GridItem h={'100%'} p={8}>
                    <Grid h={'100%'} gridTemplateColumns={'50% 50%'}
                                     gridTemplateRows={'92% 3%'}>
                        <GridItem h={'100%'}>
                            <Stack direction='row' spacing={4}>
                                <Avatar>
                                    <AvatarBadge boxSize='1.25em' bg='green.500' />
                                </Avatar>
                            </Stack>
                        </GridItem>
                        <GridItem h={'100%'} p={8} fontWeight={'bold'} fontSize={20} color={'#3E36B0'}>
                            <VStack
                                spacing={4}
                                align='stretch'>
                                <Text>Name</Text>
                                <Input bg={'#fff'} variant='filled' w={'60%'} display={'block'}></Input>
                            </VStack>
                        </GridItem>
                        <GridItem colSpan={2} h={'100%'} w={'100%'}>
                            <Center>
                                <Divider color={'#3E36B0'} style={{height: '4px'}} w={'100%'} orientation="horizontal"/>
                            </Center>
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem h={'100%'} paddingLeft={8} paddingRight={8}>
                    <VStack spacing={20}
                            align='stretch'>
                        <Text fontWeight={'bold'} fontSize={20} color={'#3E36B0'}>Letter Size</Text>
                        <Slider
                            w={'50%'}
                            id='slider'
                            defaultValue={5}
                            min={0}
                            max={100}
                            colorScheme='teal'
                            onChange={(v) => setSliderValue(v)}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            >
                            <SliderMark value={0} mt='4'ml='0' fontSize='x-small' fontWeight={'bold'}>
                                A
                            </SliderMark>
                            <SliderMark value={25} mt='4'ml='0' fontSize='sm' fontWeight={'bold'}>
                                A
                            </SliderMark>
                            <SliderMark value={50} mt='4' ml='0' fontSize='md' fontWeight={'bold'}>
                                A
                            </SliderMark>
                            <SliderMark value={75} mt='4' ml='0' fontSize='lg' fontWeight={'bold'}>
                                A
                            </SliderMark>
                            <SliderMark value={100} mt='4' ml='0' fontSize='x-large' fontWeight={'bold'}>
                                A
                            </SliderMark>
                            <SliderTrack>
                                <SliderFilledTrack/>
                            </SliderTrack>
                            <Tooltip
                                hasArrow
                                bg='teal.500'
                                color='white'
                                placement='top'
                                isOpen={showTooltip}
                                label={`${sliderValue}%`}
                            >
                                <SliderThumb />
                            </Tooltip>
                        </Slider>
                        <Center>
                            <Divider color={'#3E36B0'} style={{height: '4px'}} w={'100%'} orientation="horizontal"/>
                        </Center>
                    </VStack>
                </GridItem>
                <GridItem h={'100%'}>

                </GridItem>
            </Grid>
        </DoctorLayout>
    )
}

export default Setting;