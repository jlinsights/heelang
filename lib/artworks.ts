import type { Artwork, Artist } from "./types"

export const artistData: Artist = {
  name: "이름 예시 (Artist Name)",
  bio: "서울에서 활동하는 현대 서예가입니다. 전통 서예의 정신을 계승하면서도 현대적인 미감을 탐구하며, 문자의 조형성과 먹의 물성을 통해 내면의 세계를 표현합니다. 다수의 개인전과 그룹전에 참여하였으며, 그의 작품은 여러 미술관과 개인 컬렉션에 소장되어 있습니다. (This is a sample bio for a contemporary calligrapher based in Seoul. They explore modern aesthetics while inheriting the spirit of traditional calligraphy, expressing their inner world through the formative nature of characters and the properties of ink. They have participated in numerous solo and group exhibitions, and their works are held in several art museums and private collections.)",
  statement:
    "나의 작업은 선과 공간, 여백의 관계를 탐구하는 과정입니다. 각 획은 순간의 호흡이며, 전체 구성은 우주적 질서와 조응하고자 하는 염원을 담고 있습니다. 전통에 뿌리를 두되, 동시대의 감성과 소통하는 새로운 서예의 가능성을 모색합니다. (My work is a process of exploring the relationship between line, space, and emptiness. Each stroke is a breath of the moment, and the overall composition embodies a desire to correspond with cosmic order. While rooted in tradition, I seek new possibilities for calligraphy that communicate with contemporary sensibilities.)",
  profileImageUrl: "/images/artist/profile.jpg",
}

export const artworksData: Artwork[] = [
  {
    id: "1",
    slug: "silent-echoes",
    title: "고요한 메아리 (Silent Echoes)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "70 x 140 cm",
    description:
      "고요함 속에서 울려 퍼지는 내면의 소리를 형상화한 작품입니다. (This piece visualizes the inner voice echoing in silence.)",
    imageUrl: "/images/artworks/silent-echoes.jpg",
    artistNote:
      "먹의 농담과 선의 속도감을 통해 보이지 않는 울림을 표현하고자 했습니다. (I aimed to express invisible reverberations through the shades of ink and the speed of lines.)",
  },
  {
    id: "2",
    slug: "flowing-time",
    title: "흐르는 시간 (Flowing Time)",
    year: 2023,
    medium: "장지에 먹과 채색 (Ink and light color on Jangji paper)",
    dimensions: "100 x 100 cm",
    description:
      "시간의 흐름과 그 속에서의 변화를 유려한 선으로 담아냈습니다. (This work captures the flow of time and the changes within it using elegant lines.)",
    imageUrl: "/images/artworks/flowing-time.jpg",
    artistNote:
      "멈추지 않고 변화하는 시간의 본질을 서예적 언어로 풀어내고자 했습니다. (I sought to unravel the essence of ever-changing time in the language of calligraphy.)",
  },
  {
    id: "3",
    slug: "whispers-of-wind",
    title: "바람의 속삭임 (Whispers of Wind)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "50 x 70 cm",
    description:
      "보이지 않는 바람의 움직임과 소리를 서예적 필치로 표현한 작품입니다. (A piece that expresses the invisible movement and sound of the wind through calligraphic strokes.)",
    imageUrl: "/images/artworks/whispers-of-wind.jpg",
  },
  {
    id: "4",
    slug: "inner-landscape",
    title: "내면 풍경 (Inner Landscape)",
    year: 2023,
    medium: "캔버스에 아크릴과 먹 (Acrylic and Ink on Canvas)",
    dimensions: "120 x 90 cm",
    description:
      "마음 속에 펼쳐진 추상적인 풍경을 담았습니다. (This artwork depicts an abstract landscape unfolding within the mind.)",
    imageUrl: "/images/artworks/inner-landscape.jpg",
    artistNote:
      "서예의 필획을 현대 회화의 맥락에서 재해석하여 새로운 조형 언어를 시도했습니다. (I attempted a new formative language by reinterpreting calligraphic strokes in the context of modern painting.)",
  },
  {
    id: "5",
    slug: "meditation-space",
    title: "명상의 공간 (Meditation Space)",
    year: 2024,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "90 x 90 cm",
    description:
      "고요한 사유와 명상을 위한 공간을 서예로 표현했습니다. (A calligraphic representation of a space for quiet contemplation and meditation.)",
    imageUrl: "/images/artworks/meditation-space.jpg",
  },
  {
    id: "6",
    slug: "dance-of-ink",
    title: "먹의 춤 (Dance of Ink)",
    year: 2023,
    medium: "화선지에 먹 (Ink on Mulberry Paper)",
    dimensions: "140 x 70 cm",
    description:
      "종이 위에서 펼쳐지는 먹의 역동적인 움직임을 포착했습니다. (Captures the dynamic movement of ink unfolding on paper.)",
    imageUrl: "/images/artworks/dance-of-ink.jpg",
  },
]
