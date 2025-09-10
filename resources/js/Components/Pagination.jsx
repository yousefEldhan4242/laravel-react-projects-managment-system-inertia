import { Link } from "@inertiajs/react";
import React from "react";

const Pagination = ({ links ,queryParams}) => {

    const PreserveParams = (url,params) => {
        let finalUrl = url;
        Object.entries(params).forEach(([key, value]) => {
            if (key != "page"){
                finalUrl = finalUrl + `&${key}=${value}`
            }
        })
        return finalUrl

    }
    
    return (
        <nav className="text-center mt-4">
            {links.map((link,index) => (
                <Link
                    key={index}
                    href={link.url ? PreserveParams(link.url,queryParams) : ""}
                    preserveScroll
                    className={
                        "inline-block py-2 px-3 rounded-lg text-xs text-gray-200 " +
                        (link.active ? "bg-gray-950 " : " ") +
                        (!link.url
                            ? "!text-gray-500 cursor-not-allowed "
                            : "hover:bg-gray-950 ")
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                ></Link>
            ))}
        </nav>
    );
};

export default Pagination;
