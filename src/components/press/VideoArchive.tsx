"use client";

import { Box, Heading, AspectRatio, VStack, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function VideoArchive() {
  const samples = [
    {
      id: "vid-1",
      url: "https://youtu.be/fZLzTMFRwMA?si=SrPl4oYKMu2iS1Xl",
      title: "Recuerdos de la Alhambra",
      description: "by Francisco Tarrega",
    },
    {
      id: "vid-2",
      url: "https://youtu.be/EmCZwcvVr5I?si=dRdoRrk0kcTTD0Kd",
      title: "Romance de los Pinos",
      description: "Tis the Session",
    },
  ];

  return (
    <Box w="100%" columns={{ md: 1 }} >
      <Heading size="lg" mb={6}>
        Video Archive
      </Heading>

      <VStack spacing={8} align="stretch" >
        {samples.map((v) => (
          <Box
	    w="100%"
            key={v.id}
            borderRadius="md"
            overflow="hidden"
            boxShadow="sm"
            bg="gray.50"
          _dark={{ bg: "gray.700" }}
	  columns={{ md: 2 }}
          >
            
              <ReactPlayer src={v.url} width="100%" height="100%" controls />
            
            <Box p={3}>
              <Text fontWeight="semibold">{v.title}</Text>
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
                {v.description}
              </Text>
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

// <AspectRatio ratio={16 / 9}></AspectRatio>
