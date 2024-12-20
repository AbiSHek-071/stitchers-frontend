import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import axiosInstance from "@/AxiosConfig";

const FilterSidebar = ({ className, selectedFilters, setSelectedFilters }) => {
  const [categories, setCategories] = useState([]);
  const sizes = ["S", "M", "L", "XL"];
  const sleeves = ["short", "long", "sleeveless"];

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/user/categories");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    console.log(selectedFilters);
  }, [selectedFilters]);

  const handleFilterChange = (filterType, option) => {
    setSelectedFilters((prev) => {
      const currentOptions = prev[filterType];
      const updatedOptions = currentOptions.includes(option)
        ? currentOptions.filter((item) => item !== option)
        : [...currentOptions, option];

      return {
        ...prev,
        [filterType]: updatedOptions,
      };
    });
  };

  const filterOptions = {
    Category: categories.map((cat) => cat.name),
    Sleeve: sleeves,
    Size: sizes,
  };

  return (
    <div className={className}>
      <h2 className='text-xl font-semibold mb-4'>Filters</h2>
      <Accordion type='single' collapsible className='w-full'>
        {Object.keys(filterOptions).map((filter) => (
          <AccordionItem key={filter} value={filter.toLowerCase()}>
            <AccordionTrigger className='text-sm font-medium'>
              {filter}
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {filterOptions[filter].map((option) => (
                  <div key={option} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`${filter}-${option}`}
                      checked={selectedFilters[filter.toLowerCase()].includes(
                        option
                      )}
                      onCheckedChange={() =>
                        handleFilterChange(filter.toLowerCase(), option)
                      }
                    />
                    <label
                      htmlFor={`${filter}-${option}`}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
