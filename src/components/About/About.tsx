import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>About the Application</h1>
      <p>
        This application was developed as part of the RS School React course.
      </p>
      <p>
        <Link to="https://rs.school/courses/reactjs" target="_blank">
          RS School React Course
        </Link>
      </p>
      <p>Author: Averkin Andrei</p>
      <Link to="/">Back to Search</Link>
    </div>
  );
};
