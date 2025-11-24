import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { Typography } from "@mui/material";
import AnimalCardInformation from "../components/Informacion/AnimalCards";

const Blog = () => {

    const [news, setNews] = useState([]);

    function parseAuthorAndDate(text) {
        if (!text) return { author: null, date: null };
        const parts = text.split(/[-|]/);
        if (parts.length >= 2) {
            return {
                author: parts[0].trim(),
                date: parts[1].trim()
            };
        }
        return { author: text.trim(), date: null };
    }

    useEffect(() => {

const fetchNews = async () => {
    try {
        const proxy = "https://api.allorigins.win/raw?url=";
        const target = "https://larepublica.pe/tag/serfor";

        // ==========================
        // 1️⃣ PRIMER SCRAPE (TÍTULOS)
        // ==========================
        const res1 = await fetch(proxy + encodeURIComponent(target));
        const html1 = await res1.text();

        const parser1 = new DOMParser();
        const doc1 = parser1.parseFromString(html1, "text/html");

        const containers = doc1.querySelectorAll(".ListSection_list__section--content__pFNlk");

        let titlesData = [];
        containers.forEach(div => {

            const linkEl = div.querySelector("a.ListSection_list__section--title__hwhjx");
            const url = linkEl ? "https://larepublica.pe" + linkEl.getAttribute("href") : null;

            const titleEl = div.querySelector("h2");
            const title = titleEl ? titleEl.textContent.trim() : null;

            const authorEl = div.querySelector("div[class^='ListSection_list__section--author']");
            const rawAuthorText = authorEl ? authorEl.textContent.trim() : null;
            const { author, date } = parseAuthorAndDate(rawAuthorText);

            titlesData.push({ url, title, author, date });
        });


        // ==========================
        // 2️⃣ SEGUNDO SCRAPE (IMÁGENES)
        // ==========================
        const res2 = await fetch(proxy + encodeURIComponent(target));
        const html2 = await res2.text();

        const parser2 = new DOMParser();
        const doc2 = parser2.parseFromString(html2, "text/html");

        const items = doc2.querySelectorAll('div[class^="ListSection_list__section--item"]');

        let imagesData = [];
        items.forEach(item => {
            const imgEl = item.querySelector('img[class^="ListSection_list__section--image"]');
            const image = imgEl ? imgEl.src : null;
            imagesData.push(image);
        });


        // ==========================
        // 3️⃣ COMBINAR POR ÍNDICE
        // ==========================
        let finalData = titlesData.map((item, i) => ({
            ...item,
            image: imagesData[i] || null
        }));

        console.log(finalData);
        setNews(finalData);

    } catch (error) {
        console.error("Error obteniendo noticias:", error);
    }
};



        fetchNews();

    }, []);

    return (
        <div>
            <Box sx={{ mt:'70px', display:'flex' }}>
                <Typography
                    variant="h3"
                    sx={{ mt:5, py:3, width:'100vw', textAlign:'center', fontWeight:'bold' }}
                >
                    CONOCE MÁS SOBRE NUESTRA FAUNA
                </Typography>
            </Box>

            <Box sx={{ display:'flex', p:5, flexWrap:'wrap', justifyContent:'center', gap: 4 }}>

                {news.map((item, idx) => (
                    <a key={idx} href={item.url} style={{ textDecoration:'none' }}>
                        
                        <AnimalCardInformation
                            imgAnimal={item.image}
                            textAlter="Noticia"
                            title={item.title}
                            description={`${item.date} · ${item.author}`}
                            sxImage={{
                                width: "220px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px"
                            }}
                        />

                    </a>
                ))}

            </Box>
        </div>
    );
};

export default Blog;
