import { useEffect, useState, useCallback } from "react";

const InfiniteScroll = () => {
  const URL = "https://picsum.photos/v2/list";
  const [images, setImages] = useState<
    Array<{
      id: number;
      author: string;
      width: string;
      height: string;
      url: string;
      download_url: string;
    }>
  >([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchImages();
  }, [page]);
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);
  const fetchImages = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${URL}?page=${page}&limit=5`);
      const data = await res.json();
      if (data && Array.isArray(data)) {
        setImages((prevImages) => [...prevImages, ...data]);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  return (
    <div>
      <h1>Infinite Scroll</h1>
      <div className="flex gap-4 flex-wrap  justify-center items-center ">
        {images &&
          images.map((image, index) => (
            <div key={index} className=" items-center  rounded-md ">
              <img
                className="h-[250px] w-[150px] rounded-t-md  "
                src={image.download_url}
                alt=""
              />
              <h3 className="p-2 font-semibold items-center">{image.author}</h3>
            </div>
          ))}
      </div>
    </div>
  );
};

export default InfiniteScroll;
