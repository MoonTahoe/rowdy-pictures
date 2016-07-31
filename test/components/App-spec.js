import { expect } from 'chai'
import { shallow } from 'enzyme'
import App from '../../components/App'

describe("<App /> Component", () => {

    it("renders default star", () =>
        expect(shallow(<App />).find('div.app')).to.have.length(1)
    )

})