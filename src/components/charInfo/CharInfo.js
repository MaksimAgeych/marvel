import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = memo((props) => {
    const [char, setChar] = useState(null);
    const {getCharacter, clearError, process, setProcess} = useMarvelService();

    useEffect(() => {
            updateChar();
    }, [props.charId]);

    const updateChar = () => {
        const {charId} = props;

        if(!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
        .then(onCharLoaded)
        .then(() => setProcess('confirmed'));
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    return (
        <div className="char__info">
            {setContent(process, View, char)}
        </div>
    )
});

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;

    let imgStyle = {'objectFit' : 'cover'};

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                { comics.length > 0 ? null : 'There is no comics with this character'}

                {
                    comics.map((item, i) => {
                        if (i > 9)  return;
                        let id = item.resourceURI.split('/');
                        id = id[id.length - 1];

                        return (
                            <Link to={`/comics/${id}`} key={i} className="char__comics-item">
                                {item.name}
                            </Link>
                        )
                    })
                }
            </ul>
        </>
    )
} 

CharInfo.propTypes = {
    charId: propTypes.number
}

export default CharInfo;