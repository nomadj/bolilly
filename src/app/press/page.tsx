"use client";

import {
  Box,
  Flex,
  Heading,
  Container,
  useBreakpointValue,
  Tabs,
} from "@chakra-ui/react";
import Bio from "@/components/press/Bio";
import VideoArchive from "@/components/press/VideoArchive";
import AudioArchive from "@/components/press/AudioArchive";
import PhotoGallery from "@/components/press/PhotoGallery";

export default function PressPage() {
  const tabOrientation = useBreakpointValue({
    base: "horizontal",
    md: "vertical",
  });

  return (
    <Container maxW="container.lg" py={8}>
    

      <Heading mb={6} size="2xl">
        Press Kit
      </Heading>

      <Tabs.Root
        orientation={tabOrientation}
        defaultValue="bio"
        colorScheme="purple"
        variant="soft-rounded"
      >
        <Flex direction={{ base: "column", md: "row" }} gap={6}>
          {/* Tab List */}
          <Box minW={{ md: "220px" }} flexShrink={0}>
            <Tabs.List>
              <Tabs.Trigger _hover={{ boxShadow: "sm" }} value="bio">Bio</Tabs.Trigger>
              <Tabs.Trigger _hover={{ boxShadow: "sm" }} value="video">Video</Tabs.Trigger>
              <Tabs.Trigger _hover={{ boxShadow: "sm" }} value="audio">Audio</Tabs.Trigger>
              <Tabs.Trigger _hover={{ boxShadow: "sm" }} value="photos">Photos</Tabs.Trigger>
            </Tabs.List>
          </Box>

          {/* Tab Panels */}
          <Box
            flex="1"
            bg="white"
            _dark={{ bg: "gray.800" }}
            borderRadius="lg"
            p={6}
            boxShadow="sm"
            // w="100vw"
            // ml="-50%"
            // transform="translateX(50%)"
           >
            <Box w="100%" p={{ base: 0, md: 6 }}>
            <Tabs.Content value="bio">
              <Bio />
            </Tabs.Content>
            <Tabs.Content value="video">
              <VideoArchive />
            </Tabs.Content>
            <Tabs.Content value="audio">
              <AudioArchive />
            </Tabs.Content>
            <Tabs.Content value="photos">
              <PhotoGallery />
            </Tabs.Content>
          </Box>
          </Box>
        </Flex>
      </Tabs.Root>
    </Container>
  );
}
