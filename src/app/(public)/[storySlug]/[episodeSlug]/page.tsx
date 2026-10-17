import { redirect, RedirectType } from 'next/navigation';

interface StoryEpisodeProps {
  params: Promise<{ storySlug: string; episodeSlug: string }>;
}

export default async function StoryEpisodePage({ params }: StoryEpisodeProps) {
  const { episodeSlug } = await params;
  redirect(`/${episodeSlug}`, RedirectType.replace);
}
