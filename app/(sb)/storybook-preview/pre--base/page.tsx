import React from "react";
import { composeStory } from "@storybook/react";
import { getArgs } from "../components/args";
import { Prepare, StoryAnnotations } from "../components/Prepare";
import { Args } from "@storybook/react";

const page = async () => {
  const stories = await import("../../../../components/docs/mdx/pre.stories");
  const projectAnnotations = {};
  const Composed = composeStory(
    stories.Base,
    stories.default,
    projectAnnotations?.default || {},
    "Base"
  );
  const extraArgs = await getArgs(Composed.id);

  const { id, parameters, argTypes, args: initialArgs } = Composed;
  const args = { ...initialArgs, ...extraArgs };

  const storyAnnotations: StoryAnnotations<Args> = {
    id,
    parameters,
    argTypes,
    initialArgs,
    args,
  };
  return (
    <>
      <Prepare story={storyAnnotations} />
      {/* @ts-ignore TODO -- why? */}
      <Composed {...extraArgs} />
    </>
  );
};
export default page;
