import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillsList.css';

const formatMonthAndYear = (dateString) => {
  const date = new Date(dateString);
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  const day = date.getDate();
  return { monthName, day, year };
};

const BillsList = () => {
  const [billsData, setBillsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchBillsData = async () => {
      try {
        const response = await axios.get('http://localhost:9007/bills/getbills');
        const bills = response.data;
        const sortedBills = bills.sort((a, b) => new Date(a.duedate) - new Date(b.duedate));
        setBillsData(sortedBills);
      } catch (error) {
        console.error('There was an error fetching the bills data!', error);
      }
    };

    fetchBillsData();
  }, []);

  const totalPages = Math.ceil(billsData.length / itemsPerPage);
  const displayedBills = billsData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bills-list-container">
      <table className="table table-striped table-hover">
        {/* <thead>
          <tr>
            <th>Duedate</th>
            <th>Bill Name</th>
            <th>Amount</th>
          </tr>
        </thead> */}
        <tbody>
          {displayedBills.map((bill, index) => {
            const { monthName, day, year } = formatMonthAndYear(bill.duedate);
            return (
              <tr key={index}>
                <td>
                  <div className="bills-list-date">
                    <div>{monthName}</div>
                    <div>{day} {year}</div>
                  </div>
                </td>
                <td>{bill.billname}</td>
                <td>${bill.amount.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Conditionally render pagination if there's more than one page */}
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <span
              key={index}
              onClick={() => handlePageClick(index)}
              className={currentPage === index ? 'dot active' : 'dot'}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillsList;