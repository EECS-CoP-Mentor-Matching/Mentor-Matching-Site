import React from 'react';
import menteeService from '../../service/menteeService';

function MenteePortal() {
  function FetchInterests() {
    const read = async () => {
      const response = await menteeService.readInterests();
      console.log(response);
    }
    read();
  }

  return (
    <div>
      <button onClick={FetchInterests}>Login</button>
    </div>
  );
}

export default MenteePortal;