FROM nimmis/apache-php5

WORKDIR /home/nimmis

COPY ./backend .

EXPOSE 80

CMD ["php", "-S", "0.0.0.0:80", "-t", "."]
