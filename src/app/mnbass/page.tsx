"use client";

import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function MnBassPage() {
  const videos = [
    {
      url: "https://youtu.be/F78GGWZ0MLs",
      title: "Lesson 1",
      desc: "Proper stretching before playing, being conscuious of sympathetic vibration, and creating clean, articulate bass lines",
    },
  ];

  return (
    <Box p={8}>
      <Heading ml={20} mb={6}>Student MNBass</Heading>
      <SimpleGrid
	columns={{ base: 1, sm: 1, md: 3 }}
	gap={6}
	justifyItems="center"
      >
	{videos.map((vid) => (
	  <Box
	    key={vid.url}
	    width="100%"
	    maxW="400px"
	    p={4}
	    borderRadius="xl"
	    boxShadow="md"
	    transition="all 0.25s ease"
	    _hover={{
	      transform: "translateY(-6px)",
	      boxShadow: "lg",
	    }}
	  >
	    {/*Responsive wrapper*/}
	    <Box position="relative" width="100%" paddingTop="56.25%" mb={3} borderRadius="lg" overflow="hidden">
	      <ReactPlayer
		src={vid.url}
		controls
		width="100%"
		height="100%"
		style={{ position: "absolute", top: 0, left: 0 }}
	      />
	    </Box>

	    <Text fontSize="xl" fontWeight="bold" mb={1}>
	      {vid.title}
	    </Text>

	    <Text color="gray.500" fontSize="sm">
	      {vid.desc}
	    </Text>
	  </Box>
	))}
      </SimpleGrid>
    </Box>
  );

}
