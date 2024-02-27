import React from 'react';
import '../Footer.css';

function Footer() {
  const socialLinks = [
    { name: 'Facebook', url: '#' },
    { name: 'Instagram', url: '#' },
    { name: 'Twitter', url: '#' },
  ];

  return (
    <footer className="footer">
      <div className="social-links">
        {socialLinks.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.name}
          </a>
        ))}
      </div>
      <p className="message">¡Gracias por visitar Tapaco Cine!</p>
    </footer>
  );
}

export default Footer;
