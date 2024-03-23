import React, { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import Home from "../components/Home";
import { login, postPrefs } from "../data/home";
import { MODES } from "../constants";

export default function HomeContainer() {

  const toast = useToast();
  const [loading, setLoading] = useState({
    [MODES.VIDEO]: false,
    [MODES.TEXT]: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    login();
  }, []);

  const handleSubmit = async ({ prefs, next, mode }) => {
    setLoading((prev) => ({ ...prev, [mode]: true }));
    toast({
      title: "Saving preferences",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    const { status } = await postPrefs(prefs);
    setLoading((prev) => ({ ...prev, [mode]: false }));
    toast({
      title: status ? "Preferences saved" : "Error",
      status: status ? "success" : "error",
      description: status ? "" : "An error occurred while saving preferences ",
      duration: 3000,
      isClosable: true,
    });
    if (status && !!next) navigate(next);
  };

  return <Home loading={loading} handleSubmit={handleSubmit} />;
}
