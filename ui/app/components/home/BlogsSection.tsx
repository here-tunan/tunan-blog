'use client'
import React, {useEffect, useState} from "react";
import BlogList from "@/app/components/blog/BlogList";
import service from "@/app/api/request";
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.5 } }
};

export default function BlogsSection() {

  const [blogs, setBlogs] = useState([]);

  // Make a request for data to an API
  useEffect(() => {
    service.post('/article/list', {
      type: 1,
      pageSize: 10,
      pageIndex: 1,
    })
    .then(function (response) {
      console.log(response.data);
      let data = response.data;
      if (data.success) {
        setBlogs(data.data);
      }
      console.log(data.data)
    })
    .catch(function (error) {
      console.log(error);
    });
  }, []);

  return (
    <motion.section
      className="section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <header className="section-header">
        <h3 className="title">Lasted Blogs</h3>
        <a href="/blog" className="viewall">
          <span>View all</span>
        </a>
      </header>

      <AnimatePresence initial={false} custom={{delay: 0.2}}>
        {blogs.length > 0 && <BlogList key="blog-list" blogs={blogs} />}
      </AnimatePresence>
    </motion.section>
  )
}