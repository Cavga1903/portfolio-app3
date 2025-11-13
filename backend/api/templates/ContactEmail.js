const React = require('react');
const {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
} = require('@react-email/components');

function ContactEmail({ name, email, message, language, timestamp }) {
  return React.createElement(
    Html,
    null,
    React.createElement(Head),
    React.createElement(
      Body,
      { style: main },
      React.createElement(
        Container,
        { style: container },
        React.createElement(
          Section,
          { style: header },
          React.createElement(Heading, { style: h1 }, 'New Contact Form Submission')
        ),
        React.createElement(
          Section,
          { style: content },
          React.createElement(
            Section,
            { style: infoBox },
            React.createElement(Text, { style: label }, 'Name:'),
            React.createElement(Text, { style: value }, name),
            React.createElement(Text, { style: label }, 'Email:'),
            React.createElement(Link, { href: `mailto:${email}`, style: emailLink }, email),
            React.createElement(Text, { style: label }, 'Language:'),
            React.createElement(Text, { style: value }, language || 'Unknown'),
            React.createElement(Text, { style: label }, 'Time:'),
            React.createElement(Text, { style: value }, timestamp)
          ),
          React.createElement(
            Section,
            { style: messageBox },
            React.createElement(Heading, { style: h2 }, 'Message:'),
            React.createElement(Text, { style: messageText }, message)
          )
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(
          Section,
          { style: footer },
          React.createElement(
            Text,
            { style: footerText },
            'This email was sent from your portfolio contact form.'
          )
        )
      )
    )
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  backgroundColor: '#4CAF50',
  borderRadius: '8px 8px 0 0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center',
};

const content = {
  padding: '24px',
};

const infoBox = {
  backgroundColor: '#f5f5f5',
  padding: '20px',
  borderRadius: '5px',
  marginBottom: '20px',
};

const label = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '8px 0 4px 0',
};

const value = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 12px 0',
};

const emailLink = {
  color: '#4CAF50',
  fontSize: '14px',
  textDecoration: 'underline',
  margin: '0 0 12px 0',
  display: 'block',
};

const messageBox = {
  backgroundColor: '#ffffff',
  padding: '20px',
  borderLeft: '4px solid #4CAF50',
  marginTop: '20px',
};

const h2 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const messageText = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  margin: '0',
};

const hr = {
  borderColor: '#eeeeee',
  margin: '20px 0',
};

const footer = {
  padding: '0 24px',
};

const footerText = {
  color: '#999999',
  fontSize: '12px',
  textAlign: 'center',
  margin: '0',
};

module.exports = ContactEmail;

