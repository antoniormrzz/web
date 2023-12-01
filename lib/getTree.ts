import { getPage } from "./getPage";

export async function getTree(): Promise<TreeNodeProps[] | undefined> {
  // -----------------------------------------------------------------------
  // Fetch all docs pages from the repo
  // -----------------------------------------------------------------------
  const res = await fetch(
    "https://api.github.com/repos/storybookjs/web/git/trees/main?recursive=1",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_STORYBOOK_BOT_PAT}`,
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "storybook-bot",
      },
      cache: "no-store", // To remove when solving the cache error
    }
  );

  if (!res.ok) return undefined;

  const repoFiletree: {
    tree: [{ path: string }];
  } = await res.json();

  const filesArray = repoFiletree.tree
    .map((obj) => obj.path)
    .filter(
      (path) =>
        [".mdx", "md"].some((e) => path.endsWith(e)) && path.startsWith("docs/")
    );

  const pages: Meta[] = [];

  for (const file of filesArray) {
    const post = await getPage(file);
    if (post) {
      const { meta } = post;
      pages.push(meta);
    }
  }

  // -----------------------------------------------------------------------
  // Create temporary tree
  // This helps to create the scaffolding for the tree
  // -----------------------------------------------------------------------
  const tree: any[] = [];
  pages.forEach((page) => {
    let currentLevel = tree;

    page.segments.forEach((currentSegment) => {
      const existingPath = currentLevel.find(
        (e) => e.currentSegment === currentSegment
      );

      if (existingPath) {
        currentLevel = existingPath.children;
      } else {
        const newPart = {
          currentSegment,
          id: page.id,
          children: [],
        };

        currentLevel.push(newPart);
        currentLevel = newPart.children;
      }
    });
  });

  // -----------------------------------------------------------------------
  // Add the correct data to the tree
  // If a folder has an index file (index.mdx), then the folder's data
  // should be the index file's data. If a folder doesn't have an index
  // file, then the folder's data should not have anything.
  // -----------------------------------------------------------------------
  const addPageDataToTreeNode = (
    node: TemporaryTreeNodeProps,
    parent: TemporaryTreeNodeProps
  ) => {
    if (node.children.length === 0) {
      // we're at a leaf node, an actual file
      if (node.currentSegment === "index") {
        //this leaf node is an index page that needs to be added to the parent node
        Object.assign(
          parent,
          pages.find((page) => page.id === node.id)
        );
        parent.children.splice(parent.children.indexOf(node), 1);
        // delete parent.children[parent.children.indexOf(node)];
        return;
      }
      // this leaf node is a page whose info needs to be added to the current node
      Object.assign(
        node,
        pages.find((page) => page.id === node.id)
      );
      return;
    }

    // we're not at a leaf node, so we need to keep traversing the tree
    node.children.forEach((child) => {
      addPageDataToTreeNode(child, node);
    });
  };

  // Since we are mutating the tree, we need to cast it to any
  addPageDataToTreeNode(
    {
      children: tree,
      currentSegment: "",
      id: "",
    },
    tree as any
  );

  // And then we need to cast it back to TreeNodeProps
  return tree as TreeNodeProps[];
}
