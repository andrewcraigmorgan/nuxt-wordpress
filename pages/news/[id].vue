<template>
    <section v-if="news">
        <!-- Safely render title -->
        <h1 v-html="news.title?.rendered || 'Untitled News'"></h1>
        <!-- Safely render image -->
        <img :src="news.featured_media_url" alt="News Image" v-if="news.featured_media_url" />
        <!-- Safely render content -->
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

// Fetch the news post by ID
const { data: news, error } = await useFetch(`${config.public.wpApiUrl}/news/${route.params.id}`, {
    transform: async (news) => {
        if (news && news.featured_media) {
            const { data: mediaData } = await useFetch(`${config.public.wpApiUrl}/media/${news.featured_media}`);
            news.featured_media_url = mediaData.value?.source_url || null;
        } else if (news) {
            news.featured_media_url = null;
        }
        return news;
    },
});

// Dynamically set SEO metadata when the news post is available
if (news.value) {
    useHead({
        title: news.value.title?.rendered?.replace(/(<([^>]+)>)/gi, "") || "Untitled News",
        meta: [
            {
                name: "description",
                content: news.value.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "No description available.",
            },
            {
                property: "og:title",
                content: news.value.title?.rendered?.replace(/(<([^>]+)>)/gi, "") || "Untitled News",
            },
            {
                property: "og:description",
                content: news.value.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "No description available.",
            },
            {
                property: "og:image",
                content: news.value.featured_media_url || "",
            },
        ],
    });
}

// Handle errors
if (error.value) {
    console.error("Error fetching news:", error.value);
}
</script>

<style scoped>
img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 20px;
}
</style>
