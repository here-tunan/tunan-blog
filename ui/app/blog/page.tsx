'use client'
import React, {useEffect, useState} from "react";
import BlogList from "@/app/components/blog/BlogList";
import service from "@/app/api/request";

export default function Blog() {

  const [blogs, setBlogs] = useState([]);

  // Make a request for data to an API
  useEffect(() => {
    service.post('/article/list', {
      type: 1,
      pageSize: 100,
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
    <main>
      <div className="container">

        <BlogList blogs={blogs}/>

      </div>
    </main>
  );
}