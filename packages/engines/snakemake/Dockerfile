ARG SNAKEMAKE_VERSION
FROM 680431765560.dkr.ecr.us-west-2.amazonaws.com/aws/agc-snakemake:latest AS build

FROM public.ecr.aws/amazonlinux/amazonlinux:2 AS final
COPY --from=build  /opt/work/snakemake/ /opt/work/snakemake/
# COPY THIRD-PARTY /opt/
COPY LICENSE /opt/

RUN yum update -y \
    && yum install -y \
    curl \
    hostname \
    "java-11-amazon-corretto-headless(x86-64)" \
    unzip \
    jq \
    which \
    && yum clean -y all
RUN rm -rf /var/cache/yum

RUN amazon-linux-extras install python3.8
RUN python3.8 -m ensurepip --upgrade

# install awscli v2
RUN curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" \
    && unzip -q /tmp/awscliv2.zip -d /tmp \
    && /tmp/aws/install -b /usr/bin \
    && rm -rf /tmp/aws*

ENV JAVA_HOME /usr/lib/jvm/jre-openjdk/

COPY snakemake.aws.sh /opt/bin/snakemake.aws.sh
RUN chmod +x /opt/bin/snakemake.aws.sh

WORKDIR /opt/work/snakemake
RUN python3.8 setup.py install && pip3.8 install .

WORKDIR /opt/work
ENTRYPOINT ["/opt/bin/snakemake.aws.sh"]