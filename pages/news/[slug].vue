<template>
    <section v-if="news">
        <h1 v-html="news.title?.rendered || 'Untitled News'"></h1>
        <img :src="news.featured_media_url" alt="News Image" v-if="news.featured_media_url" />
        <div v-html="news.content?.rendered || '<p>No content available.</p>'"></div>
        <NuxtLink to="/">Back to News</NuxtLink>
    </section>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { useRoute, useFetch, useRuntimeConfig, useHead } from "#app";

const route = useRoute();
const config = useRuntimeConfig();

// Fetch the news post by slug
const { data: newsList, error } = await useFetch(`${config.public.wpApiUrl}/wp-json/wp/v2/posts?slug=${route.params.slug}`);

const news = newsList.value?.[0] || null; // WordPress returns an array, so take the first item

if (news) {
    if (news.featured_media) {
        const { data: mediaData } = await useFetch(`${config.public.wpApiUrl}/wp-json/wp/v2/media/${news.featured_media}`);
        news.featured_media_url = mediaData.value?.source_url || null;
    } else {
        news.featured_media_url = null;
    }

    // Dynamically set SEO metadata
    useHead({
        title: news.title?.rendered?.replace(/(<([^>]+)>)/gi, "") || "Untitled News Article",
        meta: [
            {
                name: "description",
                content: news.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "No description available.",
            },
            {
                property: "og:title",
                content: news.title?.rendered?.replace(/(<([^>]+)>)/gi, "") || "Untitled News",
            },
            {
                property: "og:description",
                content: news.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "No description available.",
            },
            {
                property: "og:image",
                content: news.featured_media_url || "",
            },
        ],
    });
}

// Handle errors
if (error.value) {
    console.error("Error fetching post:", error.value);
}
</script>
