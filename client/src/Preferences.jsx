import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

function Preferences() {
  return (
    <Box>
      <Heading mb={4}>Preferences</Heading>
      <Text mb={4}>Select your Preferences</Text>
      <Accordion allowToggle>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Course
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex flexDir="column" gap={4}>
              <Checkbox> B. Tech</Checkbox>
              <Checkbox> M. Tech</Checkbox>
              <Checkbox> BBA</Checkbox>
              <Checkbox> BCA</Checkbox>
              <Checkbox> MCA</Checkbox>
              <Checkbox> PhD</Checkbox>
              <Checkbox> B. Pharma</Checkbox>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Branch
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex flexDir="column" gap={4}>
              <Checkbox> CSE</Checkbox>
              <Checkbox> ECE</Checkbox>
              <Checkbox> IT</Checkbox>
              <Checkbox> EE</Checkbox>
              <Checkbox> CE</Checkbox>
              <Checkbox> ME</Checkbox>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Year
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex flexDir="column" gap={4}>
              <Checkbox> 1st Year</Checkbox>
              <Checkbox> 2nd Year</Checkbox>
              <Checkbox> 3rd Year</Checkbox>
              <Checkbox> 4th Year</Checkbox>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                Gender
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex flexDir="column" gap={4}>
              <Checkbox> Male</Checkbox>
              <Checkbox> Female</Checkbox>
              <Checkbox> Others</Checkbox>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

export default Preferences;
