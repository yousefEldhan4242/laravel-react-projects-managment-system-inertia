import React from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/16/solid";

const TableHeading = ({name,sort_field,sort_direction,children,sortChanged}) => {
    
    return (
        <th onClick={(e) => sortChanged(name)}>
            <div className="p-3 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                <div>
                    <ChevronUpIcon
                        className={
                            "w-4 " +
                            (sort_field == name &&
                            sort_direction == "asc"
                                ? "text-white"
                                : "")
                        }
                    />
                    <ChevronDownIcon
                        className={
                            "w-4 -mt-2 " +
                            (sort_field == name &&
                            sort_direction == "desc"
                                ? "text-white"
                                : "")
                        }
                    />
                </div>
            </div>
        </th>
    );
};

export default TableHeading;
