import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IcHome } from '../assets/icon';
import { SelectedNote } from '../components/atoms';
import { Page } from '../components/templates';

const Topbar = styled.section`
  width: '100%';
`;

const Example = () => {
  return (
    <Page>
      <div style={{display: 'flex'}}>
        <Link to='/' style={{textDecoration: 'none'}}>
          <IcHome />
          {/* HOME */}
        </Link>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end'}}>
        {/* <ButtonGroup>

        </ButtonGroup> */}
        <SelectedNote />
        {/* <ButtonGroup>
          
        </ButtonGroup> */}
      </div>
    </Page>
  );
};

export default Example;