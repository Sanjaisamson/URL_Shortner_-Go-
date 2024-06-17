import React from 'react';

export const CardStructure = ({ title, shortUrl, actualUrl,clicks,created_time,created_date}) => {
  return (
    <div className="link-each-card">
      <div className="link-each-card-body">
        <h5 className="link-each-card-title">{title}</h5>
        <a href={shortUrl} target='_blank' className="link-each-card-text"> Short URL : {shortUrl}</a>
        <p className="link-each-card-text">Actual Link: {actualUrl}</p>
        <p className="link-each-card-text">No.of visits: {clicks}</p>
        <p className="link-each-card-text">Created time: {created_time}</p>
        <p className="link-each-card-text">Created date: {created_date}</p>
      </div>
    </div>
  );
};
