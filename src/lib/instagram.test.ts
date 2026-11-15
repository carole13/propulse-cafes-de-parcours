import { parseInstagramFeed } from "./instagram";

const size = (w: number, h: number) => ({
  mediaUrl: `https://behold.pictures/x/${w}.webp`,
  width: w,
  height: h,
});

const image = {
  id: "1",
  permalink: "https://www.instagram.com/p/AAA/",
  mediaType: "IMAGE",
  mediaUrl: "https://cdn.instagram.com/orig.jpg",
  sizes: { small: size(300, 375), medium: size(700, 875), large: size(1000, 1250) },
  prunedCaption: "Notre premier cercle :\n  la com, sans filtre",
};
const video = {
  id: "2",
  permalink: "https://www.instagram.com/reel/BBB/",
  mediaType: "VIDEO",
  mediaUrl: "https://cdn.instagram.com/video.mp4",
  thumbnailUrl: "https://cdn.instagram.com/thumb.jpg",
};
const carousel = {
  ...image,
  id: "3",
  mediaType: "CAROUSEL_ALBUM",
  altText: "Trois photos du café",
};

describe("fil Instagram", () => {
  it("lit le format actuel de Behold ({ posts })", () => {
    const posts = parseInstagramFeed({
      username: "propulse.students",
      posts: [image, video, carousel],
    });
    expect(posts.map((p) => p.kind)).toEqual(["image", "video", "carousel"]);
    expect(posts[0]!.imageUrl).toBe("https://behold.pictures/x/700.webp");
    expect(posts[0]!.alt).toBe("Notre premier cercle : la com, sans filtre");
  });

  it("utilise la vignette pour une vidéo sans tailles", () => {
    expect(parseInstagramFeed([video])[0]!.imageUrl).toBe("https://cdn.instagram.com/thumb.jpg");
  });

  it("préfère le texte alternatif à la légende", () => {
    expect(parseInstagramFeed([carousel])[0]!.alt).toBe("Trois photos du café");
  });

  it("ignore les entrées mal formées et limite le nombre", () => {
    const many = Array.from({ length: 10 }, (_, i) => ({ ...image, id: String(i) }));
    expect(parseInstagramFeed([{ id: "x" }, ...many])).toHaveLength(6);
  });

  it("renvoie une liste vide pour une réponse inattendue", () => {
    expect(parseInstagramFeed(null)).toEqual([]);
    expect(parseInstagramFeed({ error: "paused" })).toEqual([]);
  });
});
