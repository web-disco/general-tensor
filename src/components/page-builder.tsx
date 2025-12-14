import { Hero } from "@/components/blocks/hero";
import { Features } from "@/components/blocks/features";
import { SplitImage } from "@/components/blocks/split-image";
import { FAQs } from "@/components/blocks/faqs";
import { PAGE_QUERYResult } from "@/sanity/types";
import { assertNever } from "@/lib/assertNever";

type PageBuilderProps = {
  content: NonNullable<PAGE_QUERYResult>["content"];
};

export function PageBuilder({ content }: PageBuilderProps) {
  if (!Array.isArray(content)) {
    return null;
  }

  return (
    <main>
      {content.map((block) => {
        switch (block._type) {
          case "hero":
            return <Hero key={block._key} {...block} />;
          case "features":
            return <Features key={block._key} {...block} />;
          case "splitImage":
            return <SplitImage key={block._key} {...block} />;
          case "faqs":
            return <FAQs key={block._key} {...block} />;
          default:
            // This is a fallback for when we don't have a block type
            return assertNever(block);
        }
      })}
    </main>
  );
}
