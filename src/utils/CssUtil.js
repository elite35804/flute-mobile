import { defaultTo } from 'lodash';

/**
 * Short handler for ${props => props.theme.name} with default value
 * Add px Units if name as "sz" prefix
 * @param  {[type]} name         theme property name
 * @param  {[type]} defaultValue Default Value if not found.
 * @return {[type]}              return selector for styled components
 */
function themeProp(name, defaultValue) {
    return (props) => {
        // If this means size, add px unit for styled components.
        const val = defaultTo(props.theme[name], defaultValue);
        return ( !isNaN(val) && name.startsWith("sz") ) ? `${val}px` : val;
    }
}
export { themeProp };
