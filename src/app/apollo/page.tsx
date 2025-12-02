"use client";

import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import ReactPlayer from "react-player";

export default function ApolloPage() {
  const videos = [
    {
      url: "https://youtu.be/_H2hOm259Lo",
      title: "Apollo 1",
      desc: "1 to 5 bass movement with turnaround",
    },
  ];

  return (
    <Box p={8}>
      <Heading ml={12} mb={6}>Student Apollo 🏹</Heading>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
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
            <Box
              borderRadius="lg"
              overflow="hidden"
              aspectRatio={16 / 9}
              mb={3}
            >
              <ReactPlayer
                src={vid.url}
                width="100%"
                height="100%"
                controls
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
