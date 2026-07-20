import { Box, SimpleGrid } from "@chakra-ui/react";
import ReactPlayer from "react-player";

const videos = [
  { url: "https://violet-terrible-goose-933.mypinata.cloud/ipfs/Qma94Efo5JkkZnAxRJkYho25zuh5LFm86eJFZvGM8vD9Cc", title: "Classical Guitar", key: 2},
  { url: "https://livepeercdn.studio/hls/08c4bf68ag706hko/index.m3u8", title: "Live Stream", key: 3},
  // {url: "https://livepeercdn.studio/webrtc/08c4bf68ag706hko", title: "Daily Video", key: 4 }
];

export default function VideoGrid() {
  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 1, md: 1, lg: 1 }} gap={4}>
        {videos.map((vid) => (
          <Box
            key={vid.key}
            position="relative"
            paddingTop="56.25%" // 16:9 aspect ratio
            borderRadius="2xl"
            overflow="hidden"
            shadow="md"
	    _hover={{ shadow: "xl"}}
          >
            <ReactPlayer
              src={vid.url}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: 0, left: 0 }}
              controls
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
