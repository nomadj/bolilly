"use client";

import {
  Box,
  Flex,
  Heading,
  Container,
  useBreakpointValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Bio from "@/components/press/Bio";
import VideoArchive from "@/components/press/VideoArchive";
import AudioArchive from "@/components/press/AudioArchive";
import PhotoGallery from "@/components/press/PhotoGallery";

export default function PressPage() {
  // Chakra Tabs only supports "horizontal" or "vertical"
  const tabOrientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "horizontal",
    md: "vertical",
  });

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={6} size="2xl">
        Press Kit
      </Heading>

      <Tabs
        orientation={tabOrientation}
        colorScheme="purple"
        variant="enclosed" // ✅ Chakra-compatible
      >
        <Flex direction={{ base: "column", md: "row" }} gap={6}>
          {/* Tab List */}
          <Box minW={{ md: "220px" }} flexShrink={0}>
            <TabList flexDirection={{ base: "row", md: "column" }}>
              <Tab>Bio</Tab>
              <Tab>Video</Tab>
              <Tab>Audio</Tab>
              <Tab>Photos</Tab>
            </TabList>
          </Box>

          {/* Tab Panels */}
          <Box
            flex="1"
            bg="white"
            _dark={{ bg: "gray.800" }}
            borderRadius="lg"
            p={6}
            boxShadow="sm"
          >
            <TabPanels>
              <TabPanel>
                <Bio />
              </TabPanel>
              <TabPanel>
                <VideoArchive />
              </TabPanel>
              <TabPanel>
                <AudioArchive />
              </TabPanel>
              <TabPanel>
                <PhotoGallery />
              </TabPanel>
            </TabPanels>
          </Box>
        </Flex>
      </Tabs>
    </Container>
  );
}
