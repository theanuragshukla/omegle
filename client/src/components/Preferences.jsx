import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

function Preferences({ setPrefs }) {
  const handlePrefChange = (key, val) => {
    setPrefs((prev) => ({ ...prev, [key]: val }));
  };

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
            <CheckboxGroup onChange={(val) => handlePrefChange("course", val)}>
              <Flex flexDir="column" gap={4}>
                <Checkbox value="0"> B. Tech</Checkbox>
                <Checkbox value="1"> M. Tech</Checkbox>
                <Checkbox value="2"> BBA</Checkbox>
                <Checkbox value="3"> BCA</Checkbox>
                <Checkbox value="4"> MCA</Checkbox>
                <Checkbox value="5"> PhD</Checkbox>
                <Checkbox value="6"> B. Pharma</Checkbox>
              </Flex>
            </CheckboxGroup>
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
            <CheckboxGroup onChange={(val) => handlePrefChange("branch", val)}>
              <Flex flexDir="column" gap={4}>
                <Checkbox value="0"> CSE</Checkbox>
                <Checkbox value="1"> ECE</Checkbox>
                <Checkbox value="2"> IT</Checkbox>
                <Checkbox value="3"> EE</Checkbox>
                <Checkbox value="4"> CE</Checkbox>
                <Checkbox value="5"> ME</Checkbox>
              </Flex>
            </CheckboxGroup>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

export default Preferences;
