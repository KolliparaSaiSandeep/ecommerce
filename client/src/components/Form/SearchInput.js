import React from 'react';
import { useSearch } from '../../context/search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate('/search');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form class="form-inline my-2 my-lg-0" onSubmit={handleSubmit}>
        <div className="d-flex">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            onChange={(e) => setValues({ ...values, keyword: e.target.value })}
          />

          <button class="btn btn-outline-success my-2 mx-2 my-sm-0" type="submit">
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
