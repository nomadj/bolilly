"use client";

import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function ChessPage() {
  const videos = [
    {
      url: "https://youtu.be/uKMo8skUVJ0?si=UaABssuibqha4OnF",
      title: "Punish Scholar's Mate",
      desc: "What to do when your opponent opens with an insult",
    },
    {
      url: "https://youtube.com/shorts/ZmadiGBeDW8?si=MbAfbmum41rhkjgJ",
      title: "e4 e5 Opening Trap",
      desc: "High risk, high reward",
    },
    {
      url: "https://youtube.com/shorts/cAT_4N8o6Do?si=M5ObIrgialafjpfA",
      title: "Fried Liver Attackn",
      desc: "Gotham Chess Teaches Fried Liver Attack",
    },            
    {
      url: "https://youtube.com/shorts/IlJK_bF9WyI?si=AgSci0kH895bIlIz",
      title: "Counter the Fried Liver Attack",
      desc: "Ponies and Cookies and Juicers, OH MY!",
    },
    {
      url: "https://youtube.com/shorts/gCo9CuR92BI?si=c9WsaGLkh7qu84FW",
      title: "King and Pawn Endgame",
      desc: "Gotham Chess teaches outflanking to promote the pawn and win",
    },            
  ];

  return (
    <Box p={8}>
      <Heading ml={20} mb={6}>Punish Scholars Mate</Heading>
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
