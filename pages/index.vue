<template>
    <section>
        <h1>News</h1>
        <div class="news-list">
            <article v-for="news in newsPosts" :key="news.id" class="news-item">
                <h2 v-html="news.title?.rendered || 'Untitled News'"></h2>
                <img :src="news.featured_media_url" alt="News Image" v-if="news.featured_media_url" />
                <div v-html="news.excerpt?.rendered || 'No excerpt available.'"></div>
                <NuxtLink :to="`/news/${news.slug}`">Read More</NuxtLink>
            </article>
        </div>
    </section>
</template>

<script setup>
const config = useRuntimeConfig();
import { ref } from 'vue'

const { data: newsPostsData, error } = await useFetch(`${config.public.wpApiUrl}/wp-json/wp/v2/posts`);

const newsPosts = ref([]);

if (newsPostsData.value && Array.isArray(newsPostsData.value)) {
    newsPosts.value = await Promise.all(
        newsPostsData.value.map(async (news) => {
            if (news.featured_media) {
                const { data: mediaData } = await useFetch(`${config.public.wpApiUrl}/wp-json/wp/v2/media/${news.featured_media}`);
                news.featured_media_url = mediaData.value?.source_url || null;
            } else {
                news.featured_media_url = null;
            }
            return news;
        })
    );
} else {
    console.error("News API returned invalid data:", newsPostsData.value);
}

// Log any errors
if (error.value) {
    console.error("Error fetching news:", error.value);
}
</script>

<style scoped>
.news-list {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.news-item {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
}
.news-item img {
    max-width: 100%;
    height: auto;
    margin-bottom: 16px;
    border-radius: 8px;
}
</style>
