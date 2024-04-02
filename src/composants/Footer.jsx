import './Footer.scss';
import arrowOutIcon from "@/assets/icons/ArrowOutIcon.svg";

export function Footer() {
    return (
        <div className={'footer-background'}>
            <div className={'footer-body'}>
                <div className={'footer-item left'}>
                    <h1>Cayden<br/>Entertainment<span>&copy;</span></h1>
                </div>
                <div className={'footer-item center'}>
                    <ul>
                        {/*TODO: Remplir le lien*/}
                        <li><a href={''}>Legal concept <img src={arrowOutIcon} alt="Arrow Out Icon" /></a></li>
                        {/*TODO: Remplir le lien*/}
                        <li><a href={''}>Privacy <img src={arrowOutIcon} alt="Arrow Out Icon" /></a></li>
                        {/*TODO: Remplir le lien*/}
                        <li><a href={''}>FAQs <img src={arrowOutIcon} alt="Arrow Out Icon" /></a></li>
                        {/*TODO: Remplir le lien*/}
                        <li><a href={''}>Career <img src={arrowOutIcon} alt="Arrow Out Icon" /></a></li>
                    </ul>
                </div>
                <div className={'footer-item right'}>
                    <p>
                        Subscribe to our newsletter and unlock a world of adventure, with exclusive updates, new
                        releases,
                        and special offers delivered straight to your inbox!
                    </p>
                    <div className={'footer-send-mail'}>
                        <textarea placeholder={'john.doe@gmail.com'}></textarea>
                        <button>Subscribe</button>
                    </div>

                </div>
            </div>
        </div>
    )
}