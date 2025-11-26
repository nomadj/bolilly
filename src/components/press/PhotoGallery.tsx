"use client";

import { Box, Heading, SimpleGrid, Image } from "@chakra-ui/react";

export default function PhotoGallery() {
  const photos = [
    "/press/red-curtain.jpg",
    "/press/lq-dark.jpg",
    "/press/marys-attic.jpg",
    "/press/xmas-recital.jpg",
  ];

  return (
    <Box>
      <Heading size="lg" mb={4}>
        Photo Gallery
      </Heading>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap={3}>
        {photos.map((src) => (
          <Box key={src} borderRadius="md" overflow="hidden" boxShadow="sm">
            <Image src={src} alt="Press photo" width="100%" height="100%" objectFit="cover" />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
