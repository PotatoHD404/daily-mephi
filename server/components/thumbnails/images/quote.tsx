export function Quote({rotated = false}: { rotated?: boolean }) {
    return (<svg width="37" height="30" transform={rotated ? "rotate(180 187.5 150)" : ""} viewBox="0 0 375 300"
                 fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M136.026 0.786679C141.147 -1.43439 147.689 1.27471 149.77 6.41404C152.01 11.4139 149.53 17.9377 144.388 19.9895C114.61 31.3836 89.9124 54.2318 74.2579 81.6914C61.5243 104.121 55.4025 130.186 56.7029 155.903C57.153 160.036 57.4131 164.897 60.754 167.855C63.8249 169.917 67.406 167.566 70.3668 166.431C82.8504 160.494 96.9945 158.343 110.718 159.807C130.584 162.198 149.279 173.731 159.832 190.723C176.097 216.659 170.906 252.265 151.15 274.904C141.717 285.91 128.814 293.868 114.75 297.454C94.9939 302.583 73.5677 299.754 55.3325 290.84C35.3467 281.239 19.5122 263.968 10.8197 243.72C-0.593568 217.665 -1.62386 188.362 1.56705 160.475C5.5582 125.645 19.8223 91.98 42.7189 65.2873C67.456 36.0748 100.686 15.0095 136.026 0.786679Z"
            fill="black"/>
        <path
            d="M341.522 0.786644C346.664 -1.45434 353.246 1.2946 355.296 6.47377C357.517 11.4836 354.996 17.9974 349.825 20.0193C318.936 31.8716 293.499 56.0046 277.994 84.9084C266.461 106.611 260.959 131.441 262.22 155.953C262.66 160.066 262.93 164.897 266.251 167.845C269.302 169.917 272.883 167.586 275.823 166.46C288.297 160.514 302.431 158.343 316.155 159.797C336.301 162.198 355.256 174.01 365.739 191.39C381.394 217.067 376.322 251.877 357.137 274.347C347.674 285.621 334.58 293.798 320.286 297.444C300.04 302.713 278.064 299.615 259.529 290.193C240.783 280.791 225.819 264.616 217.177 245.632C205.163 219.567 203.853 189.986 206.904 161.859C210.495 128.892 223.108 96.8404 243.764 70.7453C268.841 38.744 304.022 15.866 341.522 0.786644Z"
            fill="black"/>
    </svg>)
}
